const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors());
const stripe = require("stripe")(
  "sk_test_51PzcOC03tMrlIcEhwUAWIpO0tDV8E6w5VOiieoYNfWqyKuzO9FhiRBJ9rW8Q6lVfcUlVZlOw6h2AucmS1Ko2dAMx0098bUtcmz"
);

app.use(express.static("public"));
app.use(express.json());

const calculateOrderAmount = (items) => {
  let total = 0;
  items.forEach((item) => {
    total += item.amount;
  });
  return total;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "chf",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
    dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
  });
});

app.listen(4242, () => console.log("Node server listening on port 4242!"));
