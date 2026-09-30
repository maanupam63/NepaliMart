const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('../models/Order');

// ESEWA TEST CREDENTIALS
const ESEWA_SECRET = '8gBm/:&EnhH.1/q';
const ESEWA_PRODUCT_CODE = 'EPAYTEST';
const ESEWA_URL = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

// KHALTI TEST CREDENTIALS
const KHALTI_SECRET = 'live_secret_key_68791341fdd94846a146f0457ff7b455';
const KHALTI_URL = 'https://a.khalti.com/api/v2/epayment/initiate/';

// ESEWA — INITIATE PAYMENT
router.post('/esewa/initiate', async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ message: 'Amount and orderId required' });
    }

    const transactionUuid = `${orderId}-${Date.now()}`;
    const totalAmount = Number(amount);

    const signatureString = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA_PRODUCT_CODE}`;
    const signature = crypto
      .createHmac('sha256', ESEWA_SECRET)
      .update(signatureString)
      .digest('base64');

    const paymentData = {
      amount: totalAmount,
      tax_amount: 0,
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: ESEWA_PRODUCT_CODE,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: 'http://localhost:5001/api/payment/esewa/success',
      failure_url: 'http://localhost:5001/api/payment/esewa/failure',
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature: signature,
    };

    res.json({
      success: true,
      paymentUrl: ESEWA_URL,
      paymentData,
    });
  } catch (error) {
    console.error('eSewa initiate error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ESEWA — SUCCESS CALLBACK
router.get('/esewa/success', async (req, res) => {
  try {
    const { data } = req.query;

    if (!data) {
      return res.redirect('http://localhost:5173/orders?payment=failed');
    }

    const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
    console.log('eSewa Success:', decodedData);

    // Order update — paid
    const orderId = decodedData.transaction_uuid?.split('-')[0];
    if (orderId) {
      try {
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: 'paid',
          isPaid: true,
          paidAt: new Date(),
          paymentRef: decodedData.transaction_code || decodedData.transaction_uuid,
        });
        console.log('Order updated to paid:', orderId);
      } catch (err) {
        console.error('Order update error:', err);
      }
    }

    res.redirect(
      `http://localhost:5173/orders?payment=success&method=esewa&ref=${decodedData.transaction_uuid}`
    );
  } catch (error) {
    console.error('eSewa success error:', error);
    res.redirect('http://localhost:5173/orders?payment=failed');
  }
});

// ESEWA — FAILURE CALLBACK
router.get('/esewa/failure', async (req, res) => {
  try {
    const { data } = req.query;

    if (data) {
      const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
      const orderId = decodedData.transaction_uuid?.split('-')[0];

      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: 'failed',
        });
      }
    }
  } catch (err) {
    console.error('eSewa failure error:', err);
  }

  res.redirect('http://localhost:5173/orders?payment=failed&method=esewa');
});

// KHALTI — INITIATE PAYMENT


router.post('/khalti/initiate', async (req, res) => {
  try {
    const { amount, orderId, customerInfo } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ message: 'Amount and orderId required' });
    }

    const payload = {
      return_url: 'http://localhost:5001/api/payment/khalti/success',
      website_url: 'http://localhost:5173',
      amount: Number(amount) * 100, // Khalti uses paisa
      purchase_order_id: orderId,
      purchase_order_name: `Order ${orderId}`,
      customer_info: {
        name: customerInfo?.name || 'Customer',
        email: customerInfo?.email || 'customer@nepalimart.com',
        phone: customerInfo?.phone || '9800000000',
      },
    };

    const response = await fetch(KHALTI_URL, {
      method: 'POST',
      headers: {
        Authorization: `Key ${KHALTI_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.payment_url) {
      res.json({
        success: true,
        paymentUrl: data.payment_url,
        pidx: data.pidx,
      });
    } else {
      res.status(400).json({
        message: data.detail || 'Khalti initiation failed',
        data,
      });
    }
  } catch (error) {
    console.error('Khalti initiate error:', error);
    res.status(500).json({ message: error.message });
  }
});

// KHALTI — SUCCESS CALLBACK
router.get('/khalti/success', async (req, res) => {
  try {
    const { pidx, transaction_id, purchase_order_id, status } = req.query;

    console.log('Khalti Success:', { pidx, transaction_id, purchase_order_id, status });

    // Order update — paid
    if (purchase_order_id) {
      try {
        await Order.findByIdAndUpdate(purchase_order_id, {
          paymentStatus: 'paid',
          isPaid: true,
          paidAt: new Date(),
          paymentRef: transaction_id || pidx,
        });
        console.log('Order updated to paid:', purchase_order_id);
      } catch (err) {
        console.error('Order update error:', err);
      }
    }

    res.redirect(
      `http://localhost:5173/orders?payment=success&method=khalti&ref=${transaction_id || pidx}`
    );
  } catch (error) {
    console.error('Khalti success error:', error);
    res.redirect('http://localhost:5173/orders?payment=failed&method=khalti');
  }
});

// KHALTI — FAILURE CALLBACK
router.get('/khalti/failure', async (req, res) => {
  try {
    const { purchase_order_id } = req.query;

    if (purchase_order_id) {
      await Order.findByIdAndUpdate(purchase_order_id, {
        paymentStatus: 'failed',
      });
    }
  } catch (err) {
    console.error('Khalti failure error:', err);
  }

  res.redirect('http://localhost:5173/orders?payment=failed&method=khalti');
});

module.exports = router;