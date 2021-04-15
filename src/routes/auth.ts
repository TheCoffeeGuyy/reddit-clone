/* eslint-disable import/no-unresolved */
import { Request, Response, Router } from 'express';
import { validate, isEmpty } from 'class-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
// eslint-disable-next-line import/extensions
import User from '../entities/User';
// eslint-disable-next-line import/extensions
import auth from '../middlewares/auth';

const mapErrors = (errors) => {
  const mappedErrors = {};
  errors.forEach((error) => {
    const key = error.property;
    const value = Object.entries(error.constraints)[0][1];
    mappedErrors[key] = value;
  });
  return mappedErrors;
  // return errors.recude((prev, err) => {
  //   prev[err.property] = Object.entries(err.constraints)[0][1];
  //   return prev;
  // }, {});
};

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    // validate data
    let errors: any = {};
    const emailUser = await User.findOne({ email });
    const userName = await User.findOne({ username });

    if (emailUser) errors.email = 'Email is already taken';
    if (userName) errors.username = 'Username is already taken';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }
    // create user
    const user = new User({ email, password, username });

    errors = await validate(user);

    if (errors.length > 0) {
      return res.status(400).json(mapErrors(errors));
    }

    await user.save();
    // return user
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const errors: any = {};
    if (isEmpty(username)) errors.username = 'Username must not be empty';
    if (isEmpty(password)) errors.password = 'Password must not be empty';
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ username: 'User not found' });

    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) return res.status(401).json({ password: 'Password incorrect' });
    const token = jwt.sign({ username }, process.env.JWT_SECRET);
    res.set('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: false,
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    }));

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const me = async (_: Request, res: Response) => res.json(res.locals.user);

const logout = async (_: Request, res: Response) => {
  res.set('Set-Cookie', cookie.serialize('token', '', {
    httpOnly: process.env.NODE_ENV === 'production',
    secure: false,
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  }));
  return res.status(200).json({ success: true });
};
const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/logout', auth, logout);
router.get('/me', auth, me);
export default router;
