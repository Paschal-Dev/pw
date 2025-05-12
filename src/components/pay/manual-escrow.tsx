import React, { useState } from "react";
import EscrowManualConfirm from "./escrow-manual-confirm";
import ManualPaymentStatus from "./manual_payment_status";

export default function ManualEscrow({
  onChatToggle,
}: {
  onChatToggle: (isChatOpen: boolean) => void;
}): React.JSX.Element {
  const [isPaidClicked, setIsPaidClicked] = useState(false);

  const handlePaidToggle = () => {
    setIsPaidClicked((prev) => !prev); // Toggle the state
  };

  return isPaidClicked ? (
    <ManualPaymentStatus onChatToggle={onChatToggle} onPaidToggle={handlePaidToggle} />
  ) : (
    <EscrowManualConfirm onChatToggle={onChatToggle} onPaidToggle={handlePaidToggle} />
  );
}