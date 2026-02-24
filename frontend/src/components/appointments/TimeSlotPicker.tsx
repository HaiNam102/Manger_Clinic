import { cn } from '@utils';

interface TimeSlotPickerProps {
    slots: string[];
    selectedSlot?: string;
    onSelect: (slot: string) => void;
    disabledSlots?: string[];
    className?: string;
}

export const TimeSlotPicker = ({
    slots,
    selectedSlot,
    onSelect,
    disabledSlots = [],
    className,
}: TimeSlotPickerProps) => {
    return (
        <div className={cn("grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3", className)}>
            {slots.map((slot) => {
                const isSelected = selectedSlot === slot;
                const isDisabled = disabledSlots.includes(slot);

                return (
                    <button
                        key={slot}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => onSelect(slot)}
                        className={cn(
                            "py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 border",
                            isSelected
                                ? "bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-900/30 scale-105 z-10"
                                : isDisabled
                                    ? "bg-dark-900 border-dark-800 text-dark-600 cursor-not-allowed opacity-50"
                                    : "bg-dark-800 border-dark-700 text-dark-100 hover:border-primary-500/50 hover:bg-dark-700"
                        )}
                    >
                        {slot}
                    </button>
                );
            })}
        </div>
    );
};
