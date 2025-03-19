import  { Router } from 'express';
const router = Router();

import  { showUserBookings,processPayment } from '../controllers/booking.js';

router.route('/selected')
  .get(showUserBookings)
  .post(processPayment);

export default router;

