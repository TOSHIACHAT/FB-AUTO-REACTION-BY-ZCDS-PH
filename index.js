const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 4545;

app.use(express.static('public'));

app.use(express.json());
app.post("/sendreact", async (req, res) => {
    const { link, type, state } = req.body;
    let iamkiryu;
    try {
        iamkiryu = JSON.parse(state);
    } catch {
        return res.json({ success: false, error: "State Error" });
    }
    if (!Array.isArray(iamkiryu)) {
        return res.json({ success: false, error: "State Error" });
    }
    const cookie = iamkiryu.map((key) => key.key + "=" + key.value).join(";");
    console.log("COOKIE" + cookie);

    const payload = {
        post_id: link,
        react_type: type,
        version: "v1.7",
    };
    const headers = {
        "User-Agent":
            "Dalvik/2.1.0 (Linux; U; Android 12; V2134 Build/SP1A.210812.003)",
        Connection: "Keep-Alive",
        "Accept-Encoding": "gzip",
        "Content-Type": "application/json",
        Cookie: cookie,
    };

    await axios
        .post("https://flikers.net/android/android_get_react.php", payload, {
            headers,
        })
        .then((response) => {
            const data = response.data;
            if (data.message) {
                res.json({
                    success: true,
                    message: data.message
                });
            } else {
                res.json({
                    success: false,
                    error: "Unknown error occurred"
                });
            }
        })
        .catch((e) => {
            if (e.response && e.response.status === 403) {
                res.json({
                    success: false,
                    error: 'An error occurred while sending the reaction. Please try again later'
                });
            } else {
                res.json({
                    success: false,
                    error: 'An error occurred while sending the reaction. Please try again later.'
                });
            }
        });
});

app.listen(port, () => {
    console.log('i am alive!');
});
