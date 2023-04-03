const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Address = require("../models/addressModel");
const Product = require("../models/productModel");
const Wishlist = require("../models/wishlistModel");
const { log } = require("console");
const Email = process.env.EMAIL;
const Password = process.env.EMAILPASS;

    //INITIATING RAZORPAY INSTANCE
    let instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEYID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
});


//SECURING PASSWORD
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    next(error);
  }
};

//NODE MAILER
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: Email,
    pass: Password,
  },
});

//GETTING USER REGISTER PAGE
const getRegister = async (req, res, next) => {
  try {
    if (req.session.user) {
      res.redirect("/");
    } else {
      res.render("users/registration");
    }
  } catch (error) {
    next(error);
  }
};

//GETTING OTP PAGE
const getotp = async (req, res, next) => {
  try {
    res.redirect("/otp");
  } catch (error) {
    next(error);
  }
};

//OTP VALIDATION
const otpvalidation = async (req, res, next) => {
  try {
    (req.session.name = req.body.name),
      (req.session.email = req.body.email),
      (req.session.mobile = req.body.mobile),
      (req.session.password = req.body.password);

    const checkUser = await User.findOne({ email: req.session.email });

    var otp = Math.random();
    otp = otp * 1000000;
    otp = parseInt(otp);
    req.session.otp = otp;

    if (!checkUser) {
      var mailFormat = {
        from: "futureorganics0@gmail.com",
        to: req.body.email,
        subject: "OTP for registration",
        html:
          "<h3>OTP for account verification is </h3>" +
          "<h1 style='font-weight:bold;'>" +
          otp +
          "</h1>",
      };

      transporter.sendMail(mailFormat, (error, data) => {
        if (error) {
          return console.log(error);
        } else {
          res.render("users/otp");
        }
      });
    } else {
      res.render("users/registration", {
        message:
          "We are sorry,this email login is already exist. Try another email address",
      });
    }
  } catch (error) {
    next(error);
  }
};

//otp verification
const verifyOtp = async (req, res, next) => {
  try {
    if (req.body.otp == req.session.otp) {
      const securedPassword = await securePassword(req.session.password, 10);
      const user = new User({
        name: req.session.name,
        email: req.session.email,
        mobile: req.session.mobile,
        password: securedPassword,
      });
      const userData = await user.save();
      if (userData) {
        res.render("users/login", {
          succesmessage: "Your registration has been succesfull",
        });
      } else {
        res.re("users/registration", { message: "Registration failed!!!" });
      }
    } else {
      res.render("users/otp", { message: "Invalid OTP" });
      console.log(error.message);
    }
  } catch (error) {
    next(error);
  }
};

//RESEND OTP
const resendOtp = async (req, res, next) => {
  try {
    var otp = Math.random();
    otp = otp * 1000000;
    otp = parseInt(otp);
    req.session.otp = otp;

    const mailFormat = {
      from: "futureorganics0@gmail.com",
      to: req.session.email,
      subject: "OTP for registration",
      html:
        "<h3>OTP for account verification is </h3>" +
        "<h1 style='font-weight:bold;'>" +
        otp +
        "</h1>",
    };
    transporter.sendMail(mailFormat, (error, data) => {
      if (error) {
        return console.log(error);
      } else {
        res.render("users/otp");
      }
    });
  } catch (error) {
    next(error);
  }
};

//GETTING USER HOME PAGE
const getHomepage = async (req, res, next) => {
  try {
    let user = req.session.user;
    let username = req.session.name;
    const productlist = await Product.find({ isDelete: false }).populate({
      path: "category",
      model: "categories",
    });
    res.render("users/home", { user, productlist, username });
  } catch (error) {
    next(error);
  }
};

//GETTING USER LOGIN PAGE
const getLogin = async (req, res, next) => {
  try {
    if (req.session.user) {
      res.redirect("/");
    } else {
      const message = req.session.error;
      delete req.session.error;
      res.render("users/login", { message });
    }
  } catch (error) {
    next(error);
  }
};

//DO LOGIN
const doLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email: email });
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.status == "Unblocked") {
          req.session.user = userData;
          res.redirect("/");
        } else {
          req.session.error =
            "This website has preventsed you from browsing this URL.For more informatiion visit the help center";
          res.redirect("/login");
        }
      } else {
        res.render("users/login", { message: "Password is incorrect" });
      }
    } else {
      res.render("users/login", { message: "No user found" });
    }
  } catch (error) {
    next(error);
  }
};

//GETING PROFILE PAGE
const getProfile = async (req, res, next) => {
  try {
    const user = req.session.user;
    if (user) {
      res.render("users/userprofile", { user });
    }
  } catch (error) {
    next(error);
  }
};

//UPDATING USER
const updateUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.updateOne({ _id: id }, req.body);
    if (user) {
      req.flash("Success", "USer updated");
      res.redirect("/profile");
    }
  } catch (error) {
    next();
  }
};

//LOGGING OUT
const doLogout = async (req, res, next) => {
  try {
    req.session.destroy();
    res.redirect("/login");
  } catch (error) {
    next(error);
  }
};

//GET SINGLE PRODUCT VIEW
const getSingleProduct = async (req, res, next) => {
  try {
    let usersession = req.session.user;
    const id = mongoose.Types.ObjectId(req.params.id);
    const product = await Product.findById(id);
    const cart = await Cart.findById(usersession._id);
    const isInCart = cart?.products.some((item) => item.proId.equals(id));
    const user = req.session.user;
    res.render("users/singleProduct", { product, usersession, isInCart, user });
  } catch (error) {
    next(error);
  }
};

//GET ALL PRODUCTS
const getAllProducts = async (req, res, next) => {
  try {
    const productList = await Product.find({ isDelete: false });
    const user = req.session.user;
    let usersession = req.session.user;
    res.render("users/allProducts", { productList, usersession, user });
  } catch (error) {
    next(error);
  }
};

//ADD TO WISHLIST
const addToWishlist = async (req, res, next) => {
  try {
    const { prodId, userId } = req.body;
    const wishlist = await Wishlist.findById({ userId });
  } catch (error) {
    next();
  }
};

//GET CART PAGE
const getCart = async (req, res, next) => {
  try {
    const user_id = req.session.user._id;
    const user = req.session.user;
    const products = await Cart.findOne({ _id: user_id }).populate(
      "products.proId"
    );
    res.render("users/cart", { products, user });
  } catch (error) {
    next(error);
  }
};

//ADD TO CART
const addToCart = async (req, res, next) => {
  try {
    const id = req.params.id;

    const { proId, name, price, image, quantity } = req.body;
    const user_id = req.session.user._id;
    console.log(user_id);
    const userCart = await Cart.findOne({ _id: user_id });
    console.log(userCart);
    // let cartTotal = 0;
    // // for (let i = 0; i < userCart.products.length; i++) {
    // //   let products = userCart.products[i];
    // //   let subtotal = products.price * products.quantity;
    // //   cartTotal += subtotal;
    // // }

    // userCart &&userCart.products.forEach((product) => {
    //   cartTotal += product.price * product.quantity;
    // });

    // console.log(cartTotal);
    if (userCart) {
      const isProduct = await Cart.findOne({ proid: req.body.proId });
      if (isProduct) {
        await Cart.updateOne(
          { _id: user_id },
          {
            $push: { products: { proId, name, price, image, quantity } },
            // $set: { cartTotal: cartTotal },
          }
        );
        res.json({});
      }
    } else {
      const cart = new Cart({
        _id: user_id,
        products: [
          {
            proId: proId,
            name: name,
            price: price,
            image: image,
            quantity: quantity,
          },
        ],
        // cartTotal: price,
      });
      const cart_data = await cart.save();
      res.json({});
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//UPDATE CART
const updateCart = async (req, res) => {
  let cart;
  const user = req.session.user._id;
  try {
    let action = Number(req.body.action);
    let userCart = await Cart.findOneAndUpdate(
      { _id: user, "products.proId": req.query.q },
      { $inc: { "products.$.quantity": action } },
      { new: true }
    );
    if (!userCart) return res.status(403).json({ message: "not found" });

    //IF QUALTITY IS ZERO DELETE PRODUCT
    if (action == -1) {
      for (let item of userCart.products) {
        if (item.quantity == 0) {
          cart = await Cart.findOneAndUpdate(
            { user: user },
            { $pull: { products: { quantity: 0 } } },
            { new: true }
          );
          if (cart) {
            if (cart.products.length == 0) {
              deleteCart(cart.user);
            }
          }
        }
      }
      return res.json({ success: true, message: "updatd" });
    }
    res.json({ success: true, message: "updated" });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};

//DELETE CART
async function deleteCart(user) {
  await Cart.findOneAndDelete({ user: user }).catch((err) => {
    console.log(err);
    return;
  });
}

//REMOVE FROM CART
const removeFromCart = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Cart.findByIdAndUpdate(req.session.user._id, {
      $pull: { products: { proId: id } },
    });
    if (req.get("Origin")) {
      return;
    }
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

//GETTING CHECKOUT PAGE
const getCheckout = async (req, res, next) => {
  try {
    const user = req.session.user;
    const user_id = req.session.user._id;
    const userCart = await Cart.findOne({ _id: user_id }).populate(
      "products.proId"
    );
    const userAddresses = await Address.findOne({ _id: user }).populate(
      "addresses._id"
    );
    if (userCart) {
      res.render("users/checkout", { userCart, user, userAddresses });
    }
  } catch (error) {
    next();
  }
};

//GETTING ADDRESS PAGE
const getAddress = async (req, res, next) => {
  try {
    let user = req.session.user;
    const userAddresses = await Address.findOne({ _id: user }).populate(
      "addresses._id"
    );
    res.render("users/addresses", { user, userAddresses });
  } catch (error) {
    next(error);
  }
};

//GETTING ADD ADDRESS PAGE
const getAddAddress = async (req, res, next) => {
  try {
    let user = req.session.user;
    res.render("users/addAddress", { user });
  } catch (error) {
    next();
  }
};

//ADD NEW ADDRESS
const doAddAddress = async (req, res, next) => {
  try {
    const id = req.session.user._id;
    let user = req.session.user;
    const userAddress = await Address.findById({ _id: id });
    console.log(userAddress);
    if (userAddress) {
      await Address.updateOne(
        { _id: id },
        {
          $push: {
            addresses: {
              name: req.body.name,
              mobile: req.body.mobile,
              street: req.body.street,
              locality: req.body.locality,
              city: req.body.city,
              country: req.body.country,
              state: req.body.state,
              pincode: req.body.pincode,
            },
          },
        }
      );
    } else {
      const address = new Address({
        _id: id,
        addresses: [
          {
            name: req.body.name,
            mobile: req.body.mobile,
            street: req.body.street,
            locality: req.body.locality,
            city: req.body.city,
            country: req.body.country,
            state: req.body.state,
            pincode: req.body.pincode,
          },
        ],
      });
      const address_data = await address.save();
    }
    res.redirect("/cart/checkout");
  } catch (error) {
    next(error);
  }
};

//GETTING ORDERS PAGE
const getOrders = async (req, res, next) => {
  try {
    const user = req.session.user._id;
    const userData = req.session.user;
    const orders = await Order.find({ customer: user }).populate(
      "products.product"
    );
    console.log(orders);
    res.render("users/orders", { user, userData, orders });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//PLACING ORDER
const placeOrder = async (req, res, next) => {
  try {
    const userid = req.session.user._id;
    const userCart = await Cart.findOne({ _id: userid }).populate(
      "products.proId"
    );
   
    const userAddresses = await Address.findOne({ _id: userid });
    const address = userAddresses.addresses.find((address) =>
      address._id.equals(mongoose.Types.ObjectId(req.body.address))
    );
    for (let item of userCart.products) {
      await Product.findOneAndUpdate(
        { _id: item.proId._id },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }

    let orderAmount = 0
    const products = userCart.products.map((ele) => {
      orderAmount+=ele.price*ele.quantity
      return {
        product: ele.proId,
        quantity: ele.quantity,
        price: ele.price,
      };
    });

    let status = req.body.payment === "cod" ? "Pending" : "Placed";
    const newOrder = new Order({
      customer: req.session.user,
      shippingAddress: address,
      products: products,
      payment: req.body.payment,
      status: "Ordered",
      orderAmount:orderAmount
    });
    const order_data = await newOrder.save();

    const cartItems = await Cart.findById(req.session.user._id);
    cartItems.products = [];
    await cartItems.save();

    if (req.body.payment == "cod") {
      res.json({cod:true})
    } else {

    instance.orders.create({
      amount: orderAmount*100,
      currency: "INR",
      receipt: "" + order_data._id,
    },(err,order) => {
      if(err){
        console.log(err,'hugvbhy');
      }else{
        console.log("sjkdhcfbskjhfdb");
        res.json(order);
      }
    })
  }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//GETING COD SUCCESS PAGE
const getcodSuccess = async(req,res,next) => {
  try {
    if(req.session.user){
      res.render('users/orderSuccess')
    }else{
      res.redirect('/login');
    }
  } catch (error) {
    next();
  }
}

//GETTING ONLINE PAYMENT SUCCESS PAGE
const getonlineSuccess = async(req,res,next) => {
  try {
    if(req.session.user){
      res.render('users/onlineorderSuccess');
    }else{
      res.redirect('/login')
    }
  } catch (error) {
    next();
  }
}

//VERIFYING ONLINE PAYMENT
const verifyRazorpay = async (req,res,next) => {
  try {
    res.json({success: true})
  } catch (error) {
    console.log(error);
    next();
  }
}
module.exports = {
  getHomepage,
  getRegister,
  getotp,
  otpvalidation,
  verifyOtp,
  resendOtp,
  getLogin,
  doLogin,
  getProfile,
  updateUser,
  doLogout,
  getSingleProduct,
  getAllProducts,
  addToWishlist,
  getCart,
  addToCart,
  removeFromCart,
  getAddress,
  doAddAddress,
  updateCart,
  getCheckout,
  getAddAddress,
  getOrders,
  placeOrder,
  getcodSuccess,
  getonlineSuccess,
  verifyRazorpay
};
