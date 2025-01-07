// utils/renderPage.tsx
import React from "react";
import PayDashboard from "./pay-dashboard";
import PayP2P from "./pay-p2p";
import P2PPayment from "./p2p-payment";
import EscrowPage from "./escrow-page";
import WalletConfirm from "./wallet-confirm";
import WalletPayment from "./wallet-payment";

export const renderActivePage = (currentPage: string): React.JSX.Element => {
  switch (currentPage) {
    case "pay/v":
      return <PayDashboard />;
    case "p2p":
      return <PayP2P />;
    case "p2p-payment":
      return <P2PPayment />;
    case "escrow-page":
      return <EscrowPage />;
    case "wallet-confirm":
      return <WalletConfirm />;
    case "wallet-payment":
      return <WalletPayment />;
    default:
      return <PayDashboard />;
  }
};
