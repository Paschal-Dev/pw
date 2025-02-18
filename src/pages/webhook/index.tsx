import React, { useEffect } from "react";
import axios from "axios";

export default function WebhookPage(): React.JSX.Element {
  useEffect(() => {
    // Make the POST request when the component mounts
    axios({
      method: "post",
      url: "http://localhost:3001/pay/webhook",  // Ensure this is where your backend is running
      headers: { "Content-Type": "application/json" },
      data: { key: "value", amount: 100 },
    })
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);  // Empty dependency array means this runs only once, when the component mounts

  return <div>WebhookPage</div>;
}
