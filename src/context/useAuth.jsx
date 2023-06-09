import { createContext, useContext, useMemo } from "react";
import { useChromeStorageLocal } from "use-chrome-storage";

export const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const connectWallet = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const publicKey = await window.ethereum.request({
        method: "eth_getEncryptionPublicKey",
        params: [accounts[0]],
      });
      if (publicKey) {
        setIsLoggedIn(true);
        setUser({
          userId: accounts[0],
          publicKey: publicKey.toString("hex"),
        });
      } else {
        console.alert("Auth not signed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useChromeStorageLocal(
    "isLoggedIn",
    false
  );

  const [user, setUser] = useChromeStorageLocal("user", {
    userId: null,
    publicKey: null,
  });

  const authParams = useMemo(
    () => ({ isLoggedIn, setIsLoggedIn, user, setUser, connectWallet }),
    [isLoggedIn, setIsLoggedIn, user, setUser, connectWallet]
  );

  return (
    <AuthContext.Provider value={authParams}>{children}</AuthContext.Provider>
  );
};
