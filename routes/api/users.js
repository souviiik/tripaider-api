const express = require("express");
const router = express.Router();
// const gravatar = require('gravatar');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const config = require('config');
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
// const normalize = require('normalize-url');

const User = require("../../models/User");
const { SignupSuccess } = require("../../emailTpl/emailTemplates");

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  "/",
  check("fname", "First Name is required").notEmpty(),
  check("lname", "Last Name is required").notEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("phone", "Please include a phone number").notEmpty(),
  check("usertype", "Please select a user type").notEmpty(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fname, lname, email, phone, usertype, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // const avatar = normalize(
      //   gravatar.url(email, {
      //     s: '200',
      //     r: 'pg',
      //     d: 'mm'
      //   }),
      //   { forceHttps: true }
      // );

      user = new User({
        fname,
        lname,
        email,
        phone,
        usertype,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      /************ Node Mailer */

      let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        // secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER, // generated ethereal user
          pass: process.env.EMAIL_PASS, // generated ethereal password
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"tripaider.com" <noreply@tripaider.com>', // sender address
        to: email, // list of receivers
        subject: "Welcome to tripaider.com", // Subject line
        // text: "Hello world?", // plain text body
        html: SignupSuccess(fname, email), // html body
      });

      console.log("Message sent: %s", info.messageId);

      /************ Node Mailer */

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
