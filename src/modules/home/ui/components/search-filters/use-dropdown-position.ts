import { RefObject } from 'react';

export const useDropdownPosition = (ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>) => {
        const getDropwdownPosition = () => {
                if (!ref.current) return { top: 0, left: 0 };
                const rect = ref.current.getBoundingClientRect();
                const dropdownWidth = 240; // Set dropdown width (w-60 = 15rem = 240px)

                // Calculate the left position to center the dropdown
                let left = rect.left + window.scrollX;
                const top = rect.bottom + window.scrollY;

                if (left + dropdownWidth > window.innerWidth) {
                        // lAlign to the right if it goes out of bounds
                        left = rect.right + window.scrollX - dropdownWidth;

                        // If still out of bounds, align to the right edge of the screen
                        if (left < 0) {
                                left = window.innerWidth - dropdownWidth - 16;
                        }
                }

                if (left < 0) {
                        left = 16;
                }

                return { top, left };
        };

        return { getDropwdownPosition };
};
