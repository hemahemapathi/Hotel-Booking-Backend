import Booking from "../models/Booking.js";
import Stripe from "stripe";
import { v4 as uuidv4 } from 'uuid';

const stripe = new Stripe('sk_test_51PofX4JMju3UYc4uRnZy8xjiyOanOzPZS12jDBiuOKc4WZkx9hyHs9cuRyRQH1LhAVepJDhpEAxJiVzzhWGgfshl00TIyLb4pE');

const showUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ user: userId })
      .populate('hotel', 'name address')
      .populate('room', 'roomNumber roomType');

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user' });
    }

    const formattedBookings = bookings.map(booking => ({
      hotel: booking.hotel.name,
      hotelAddress: booking.hotel.address,
      room: booking.room.roomNumber,
      roomType: booking.room.roomType,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      totalPrice: booking.totalPrice
    }));

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings: formattedBookings
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching user bookings'
    });
  }
};

const processPayment = async (req, res) => {
  try {
    const { token, amount } = req.body;
    const amountInCents = Math.round(parseFloat(amount));
    
    if (isNaN(amountInCents) || amountInCents <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const payment = await stripe.charges.create(
      {
        amount: amountInCents,
        customer: customer.id,
        currency: 'USD',
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4()
      }
    );
    if (payment) {
      res.status(200).json({
        success: true,
        message: 'Payment Successful, Your Room is Booked!'
      });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing payment'
    });
  }
};

export { showUserBookings, processPayment };
