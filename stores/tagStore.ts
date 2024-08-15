import { getTagsByUserId } from "@/app/actions/tags";
import { TagType } from "@/types/tagsType";
import { OptionType } from "@/types/utilsType";
import { create } from "zustand";

interface TagState {
  tags: TagType[] | null;
  tagsDropdown: OptionType[];
  getTags: (userId: string) => void;
}

const useTagStore = create<TagState>()((set) => ({
  tags: null,
  tagsDropdown: [],
  getTags: async (userId: string) => {
    try {
      const response = await getTagsByUserId(userId);

      set({
        tags: response.tags,
        tagsDropdown: response.tags?.map((tag) => ({
          value: tag.id,
          label: tag.name,
        })),
      });
    } catch (err) {
      console.error(err);
    }
  },
}));

export default useTagStore;
