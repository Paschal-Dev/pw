import React, { useState } from "react";
import EscrowManualConfirm from "./escrow-manual-confirm";
import ManualPaymentStatus from "./manual_payment_status";

interface ManualEscrowProps {
  onChatToggle: (isChatOpen: boolean) => void;
  onChatOpen?: () => void; // Notify parent when chat is opened
}

export default function ManualEscrow({
  onChatToggle,
  onChatOpen,
}: ManualEscrowProps): React.JSX.Element {
  const [isPaidClicked, setIsPaidClicked] = useState(false);

  const handlePaidToggle = () => {
    setIsPaidClicked((prev) => !prev);
  };

  return isPaidClicked ? (
    <ManualPaymentStatus
      onChatToggle={onChatToggle}
      onPaidToggle={handlePaidToggle}
    />
  ) : (
    <EscrowManualConfirm
      onChatToggle={onChatToggle}
      onPaidToggle={handlePaidToggle}
      onChatOpen={onChatOpen}
    />
  );
}