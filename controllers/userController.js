const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Coupon = require("../models/couponModel");
const Address = require("../models/addressModel");
const Product = require("../models/productModel");
const Wishlist = require("../models/wishlistModel");
const Category = require("../models/categoryModel");
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
    const user = await User.findOneAndUpdate(
      { _id: id },
      { $set: { name: req.body.name, mobile: req.body.mobile } }
    );
    console.log(user);
    if (user) {
      req.flash("Success", "USer updated");
      req.session.user.name = req.body.name;
      req.session.user.mobile = req.body.mobile;
      res.redirect("/profile");
    }
  } catch (error) {
    console.log(error);
    next();
  }
};

//LOGGING OUT
const doLogout = async (req, res, next) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

//GET SINGLE PRODUCT VIEW
const getSingleProduct = async (req, res, next) => {
  try {
    let usersession = req.session.user;
    const id = req.params.id;
    console.log(id);
    const product = await Product.findById(id);
    const cart = await Cart.findOne({ _id: id });
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
    const PAGE_SIZE = 12;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * PAGE_SIZE;

    const productList = await Product.find({ isDelete: false })
      .skip(skip)
      .limit(PAGE_SIZE);
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / PAGE_SIZE);
    const categoryList = await Category.find();
    const user = req.session.user;
    let usersession = req.session.user;
    res.render("users/allProducts", {
      productList,
      usersession,
      user,
      categoryList,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    next(error);
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
    console.log(products);
    res.render("users/cart", { products, user });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { proId, name, price, image, quantity } = req.body;
    const user_id = req.session.user._id;
    const userCart = await Cart.findOne({ _id: user_id });
    console.log(userCart, "old cart");
    let cartTotal = 0;
    let subTotal = 0;
    if (userCart) {
      const isProduct = await Cart.findOne({
        _id: user_id,
        "products.proId": proId,
      });
      if (isProduct) {
        const newCart = await Cart.findOneAndUpdate(
          { _id: user_id, "products.proId": id },
          {
            $inc: { "products.$.quantity": 1 },
          },
          { returnOriginal: false }
        );
        console.log(newCart, "new cart");
        // calculate cartTotal and subTotal
        newCart.products.forEach((product) => {
          cartTotal += product.quantity * product.price;

        });
        await Cart.updateOne(
          { _id: user_id },
          {
            $set: {
              cartTotal: cartTotal,
              subTotal: cartTotal-newCart.discount,
            },
          }
        );
        res.json({ message: "Product is already in cart, Quantity Increased" });
      } else {
       const newCart = await Cart.findByIdAndUpdate(
          { _id: user_id },
          {
            $push: { products: { proId, name, price, image, quantity } },
          },
          {new: true}
        );
        // calculate cartTotal and subTotal
        newCart.products.forEach((product) => {
          cartTotal += product.quantity * product.price;

        });
        await Cart.updateOne(
          { _id: user_id },
          {
            $set: {
              cartTotal: cartTotal,
              subTotal: cartTotal-newCart.discount,
            },
          }
        );

        res.json({ message: "Product added to cart" });
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
        cartTotal: price * quantity,
        subTotal: price * quantity,
      });
      const cart_data = await cart.save();
      res.json({ message: "Product added to cart" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//UPDATE CART
const updateCart = async (req, res) => {
  let cart;
  let cartTotal = 0;
  let subTotal = 0;
  const user = req.session.user._id;
  try {
    let action = Number(req.body.action);
    let userCart = await Cart.findOneAndUpdate(
      { _id: user, "products.proId": req.query.q },
      { $inc: { "products.$.quantity": action } },
      { new: true }
    );
    // calculate cartTotal and subTotal
    userCart.products.forEach((product) => {
      cartTotal += product.quantity * product.price;
      
    });
    const newCart = await Cart.findOneAndUpdate(
      { _id: user },
      {
        $set: {
          cartTotal: cartTotal,
          subTotal: cartTotal-userCart.discount,
        },
      },
      { new: true }
    );

    console.log(newCart);
    if (!newCart) return res.status(403).json({ message: "not found" });

    //IF QUALTITY IS ZERO DELETE PRODUCT
    if (action == -1) {
      for (let item of userCart.products) {
        if (item.quantity == 0) {
          cart = await Cart.findOneAndUpdate(
            { user: user },
            { $pull: { products: { quantity: 0 } } },
            { new: true }
          );
          // calculate cartTotal and subTotal
          userCart.products.forEach((product) => {
            cartTotal += product.quantity * product.price;
          });
          const newCart = await Cart.findOneAndUpdate(
            { _id: user },
            {
              $set: {
                cartTotal: cartTotal,
                subTotal: cartTotal-userCart.discount,
              },
            },
            { new: true }
          );
          if (cart) {
            if (cart.products.length == 0) {
              deleteCart(user);
            }
          }
        }
      }
      return res.json({ success: true, message: "updatd",subTotal: newCart.subTotal });
    }
    res.json({ success: true, message: "updated", subTotal: newCart.subTotal });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};

//DELETE CART
async function deleteCart(user) {
  await Cart.findOneAndDelete({ _id: user })
    .then((e) => {
      console.log(e);
    })
    .catch((err) => {
      console.log(err);
      return;
    });
}

//REMOVE FROM CART
const removeFromCart = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Cart.findByIdAndUpdate(
      req.session.user._id,
      {
        $pull: { products: { proId: id } },
      },
      { new: true }
    );
    if (product.products.length == 0) {
      deleteCart(req.session.user._id);
    }
    console.log(product);
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
    console.log(userCart);
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
    const orders = await Order.find({ customer: user })
      .populate({
        path: "products",
        populate: { path: "product", populate: { path: "category" } },
      })
      .sort({ createdAt: -1 });
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

    let orderAmount = 0;
    const products = userCart.products.map((ele) => {
      orderAmount += ele.price * ele.quantity;
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
      orderAmount: orderAmount,
    });
    const order_data = await newOrder.save();

  
    if (req.body.payment == "cod") {
      res.json({ cod: true });
    } else {
      instance.orders.create(
        {
          amount: orderAmount * 100,
          currency: "INR",
          receipt: "" + order_data._id,
        },
        (err, order) => {
          if (err) {
            console.log(err);
          } else {
            res.json(order);
            
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};



//CANSELLING ORDER
const cancelOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);
    const canceld_order = await Order.updateOne(
      { _id: id },
      { $set: { status: "Cancelled" } }
    );
    if (canceld_order) {
      res.redirect("/profile/orders");
    }
  } catch (error) {
    console.log(error);
    next();
  }
};

//RETURNING THE ORDER
const returnOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const return_order = await Order.updateOne(
      { _id: id },
      { $set: { status: "Return Processing" } }
    );
    if (return_order) {
      res.redirect("/profile/orders");
    }
  } catch (error) {
    console.log(error);
    next();
  }
};

//GETING COD SUCCESS PAGE
const getcodSuccess = async (req, res, next) => {
  try {
    if (req.session.user) {
      res.render("users/orderSuccess");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    next();
  }
};

//GETTING ONLINE PAYMENT SUCCESS PAGE
const getonlineSuccess = async (req, res, next) => {
  try {
    if (req.session.user) {
      const cartItems = await Cart.deleteOne(req.session.user._id);
       res.render('users/onlineorderSuccess')
      } else {
      res.json({success: false})
      
    }
  } catch (error) {
    next(error);
  }
};

//VERIFYING ONLINE PAYMENT
const verifyRazorpay = async (req, res, next) => {
  try {
    console.log("in server")
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    next();
  }
};

//GETTING WISHLIST
const getWishlist = async (req, res, next) => {
  try {
    if (req.session.user) {
      const user = req.session.user;
      const products = await Wishlist.findOne({ _id: user._id }).populate(
        "products.proId"
      );
      console.log(products);
      res.render("users/wishlist", { user, products });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    next();
  }
};

//ADD TO WISHLIST
const addToWishlist = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user_id = req.session.user._id;
    const { proId, name, price, image, quantity } = req.body;
    const userWishlist = await Wishlist.findOne({ _id: user_id });
    if (userWishlist) {
      const isProduct = await Wishlist.findOne({
        _id: user_id,
        "products.proId": proId,
      });
      if (isProduct) {
        res.json({ message: "Product Already in Wishlist" });
      } else {
        await Wishlist.updateOne(
          { _id: user_id },
          {
            $push: { products: { proId, name, image, price, quantity } },
          }
        );
        res.json({ message: "Product added to Wishlist" });
      }
    } else {
      const wishlist = new Wishlist({
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
      });
      const wishlist_data = await wishlist.save();
      res.json({ message: "Product added to Wishlist" });
    }
  } catch (error) {
    console.log(error);
    next();
  }
};

//REMOVING FROM WISHLIST
const removeFromWishlist = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Wishlist.findByIdAndUpdate(req.session.user._id, {
      $pull: { products: { proId: id } },
    });
    res.redirect("/profile/wishlist");
  } catch (error) {
    next();
  }
};

//SEARCHING PRODUCTs
const searchProduct = async (req, res, next) => {
  let searchq = req.query.q ? req.query.q : "";
  let page = req.query.page ? parseInt(req.query.page) : 1;
  let limit = req.query.limit < 12 ? parseInt(req.query.limit) : 12;
  let category = req.query.category || "";
  let max = req.query.max || 5000;
  let min = req.query.min || 0;

  let price = { $gt: min, $lt: max };
  let search = { $regex: searchq, $options: "i" };
  let result = [];
  let pages = 0;
  let PAGE_SIZE = 12;
  let skip = (page - 1) * PAGE_SIZE;

  try {
    //IF CTEFORY NOT SPECIFIED
    if (category == "") {
      result = await Product.find({
        $or: [{ description: search }, { product: search }],
        price: price,
      })
        .skip((page - 1) * 12)
        .limit(limit);
      //GET TOTAL LEGTH OF PRODUCT
      pages = await Product.find({
        $or: [{ description: search }, { product: search }],
        price: price,
      }).count();
      pages = pages / 12;
    }
    //IF CATEGORY SPECIFIED
    if (category != "") {
      result = await Product.find({
        $or: [{ description: search }, { product: search }],
        price: price,
        category: category,
      })
        .skip((page - 1) * 12)
        .limit(limit);
      //GET TOTAL LEGTH OF PRODUCT
      pages = await Product.find({
        $or: [{ description: search }, { product: search }],
        price: price,
        category: category,
      }).count();
      pages = pages / 12;
    }
    const user = req.session.user;
    let usersession = req.session.user;
    const categoryList = await Category.find();

    result.pages = pages < 1 ? 1 : pages;

    req.pageUrl = `/search?q=${searchq}&min=${min}&max=${max}&limit=${limit}%category=${category}`;

    res.render("users/allProducts", {
      productList: result,
      usersession,
      user,
      categoryList,
      currentPage: page,
      totalPages: pages,
    });
  } catch (error) {
    res.redirect("/");
  }
};

// //GETTING COUPON
const applyCoupon = async (req, res, next) => {
  try {
    const total = parseInt(req.body.total);
    const couponcode = req.body.code.toUpperCase();
    const id = req.session.user._id;
    console.log(total);
    console.log(couponcode);
    const coupon = await Coupon.findOne({ code: couponcode });

    if (coupon) {
      const couponexp = coupon.expiry;
      console.log(couponexp, "expiry date");
      const nowdate = new Date();
      console.log(nowdate, "today");
      if (couponexp >= nowdate) {
        if (coupon && coupon.minimum_purchase <= total) {
          const amount = coupon.discount;
          const cartTotal = total - amount;
          await Cart.updateOne({_id:id},{$set:{discount:amount}},{$set:{cartTotal:cartTotal-discount}})
          res.json({ status: true, total: cartTotal, amount ,message:"coupon applied"})
        } else {
          res.json({status:false,message:"Coupon Not Available for this Total Amount"})
        }

      } else {
        res.json({errormessage:true,message:"Coupon Expired"})
      }
    } else {
      res.json({ errormessage: false, message: 'Invalid coupon' })
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};

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
  verifyRazorpay,
  cancelOrder,
  returnOrder,

  addToWishlist,
  getWishlist,
  removeFromWishlist,

  searchProduct,
  applyCoupon,
};
