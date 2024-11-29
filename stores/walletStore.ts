import {
  getOneWalletByWalletId,
  getWalletListByUserId,
} from "@/app/actions/wallet/";
import { WalletSchemaTypeWithId } from "@/schema/wallet";
import { OptionType } from "@/types/utilsType";
import { create } from "zustand";

interface WalletState {
  wallet: WalletSchemaTypeWithId | null;
  walletDropdown: OptionType[];
  walletList: WalletSchemaTypeWithId[];
  selectWallet: (walletId: string) => void;
  getWalletList: (userId: string) => void;
  updateWallet: (walletId: string) => void;
}

const useWalletStore = create<WalletState>()((set) => ({
  wallet: null,
  walletDropdown: [],
  walletList: [],
  selectWallet: (walletId) =>
    set((state) => {
      const selectedWallet = state.walletList.find(
        (wal: WalletSchemaTypeWithId) => wal.id === walletId
      );
      return { wallet: selectedWallet || null };
    }),
  getWalletList: async (userId: string) => {
    try {
      const response = await getWalletListByUserId(userId);
      if (response.error || !response.data) throw new Error(response.message);

      set({
        walletDropdown: response.data?.map((wal) => ({
          value: wal.id,
          label: wal.name,
        })),
        walletList: response.data as WalletSchemaTypeWithId[],
      });
    } catch (err) {
      console.error(err);
    }
  },
  updateWallet: async (walletId: string) => {
    try {
      const response = await getOneWalletByWalletId(walletId);
      if (response.error || !response.wallet) throw new Error(response.message);

      set({
        wallet: {
          ...response.wallet,
          balance: response.wallet.balance.toString(),
          description: response.wallet.description || undefined,
        },
      });
    } catch (err) {
      console.error(err);
    }
  },
}));

export default useWalletStore;
