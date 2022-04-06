var express = require("express");
var router = express.Router();
const squserModel = require("../models").Squser;
const balanceModel = require("../models").Balance;
const transactionModel = require("../models/").Transaction;
const { sequelize } = require("../models");
router.get("/users", (req, res) => {
  squserModel.findAll().then((users) => {
    res.json(users);
  }),
    (err) => {
      res.json(err);
    };
});
router.post("/users", (req, res) => {
  const { username, email, password } = req.body;
  squserModel.create({ username, email, password }).then((user) => {
    res.json({ status: 1, data: "Added user details" });
  }),
    (err) => {
      res.json(err);
    };
});
router.get("/balance", (req, res) => {
  balanceModel.findAll({ include: squserModel }).then((balances) => {
    res.json(balances);
  }),
    (err) => {
      res.json(err);
    };
});
router.post("/balance", (req, res) => {
  const { balance, userId } = req.body;
  balanceModel.create({ balance, userId }).then((balance) => {
    res.json({ status: 1, data: "Added balance details" });
  }),
    (err) => {
      res.json(err);
    };
});
router.get("/transaction", (req, res) => {
  transactionModel.findAll().then((transactions) => {
    res.json(transactions);
  }),
    (err) => {
      res.json(err);
    };
});
router.post("/transaction", (req, res) => {
  const transaction_date = new Date().toISOString();
  const { transaction_amount, userId } = req.body;
  transactionModel
    .create({ transaction_date, transaction_amount, userId })
    .then((transaction) => {
      res.json({ status: 1, data: "Added transaction details" });
    }),
    (err) => {
      res.json(err);
    };
});
router.put("/banktransaction", async (req, res) => {
  const { senderName, receiverName, amount } = req.body;
  let transaction;
  const sender = await squserModel.findOne({ where: { username: senderName } });
  if (sender === null) {
    res.json({ status: 0, data: "Sender not found" });
  } else {
    const receiver = await squserModel.findOne({
      where: { username: receiverName },
    });
    if (receiver === null) {
      res.json({ status: 0, data: "Receiver not found" });
    } else {
      try {
        transaction = await sequelize.transaction();
        const senderBalance = await balanceModel.findOne({
          where: { userId: sender.id },
        });
        if (senderBalance.balance < amount) {
          res.json({
            status: 0,
            data: "Insufficient balance to perform transaction",
          });
        } else {
          const receiverBalance = await balanceModel.findOne({
            where: { userId: receiver.id },
          });
          await balanceModel.update(
            {
              balance: Number(senderBalance.balance) - Number(amount),
            },
            { where: { userId: sender.id } },
            { transaction }
          );
          await balanceModel.update(
            {
              balance: Number(receiverBalance.balance) + Number(amount),
            },
            { where: { userId: receiver.id } },
            { transaction }
          );
          const transaction_date = new Date().toISOString();
          await transactionModel.create({
            transaction_date: transaction_date,
            transaction_amount: amount,
            userId: sender.id,
          });
          await transaction.commit();
          res.json({ status: 1, data: "Transaction done successfully" });
        }
      } catch (err) {
        if (transaction) {
          await transaction.rollback();
        }
        res.json(err);
      }
    }
  }
});
module.exports = router;
