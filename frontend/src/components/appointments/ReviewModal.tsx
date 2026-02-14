import { useState } from 'react';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { StarRating } from '@components/ui/StarRating';
import { useToast } from '@hooks/useToast';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctorName: string;
    appointmentId: string;
}

export const ReviewModal = ({ isOpen, onClose, doctorName, appointmentId }: ReviewModalProps) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { showToast } = useToast();

    const handleSubmit = async () => {
        if (rating === 0) {
            showToast.error('Please select a rating');
            return;
        }

        showToast.loading('Submitting your review...');

        // Simulate API call
        setTimeout(() => {
            showToast.success('Thank you for your feedback!');
            onClose();
            // Reset state
            setRating(0);
            setComment('');
        }, 1500);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Rate Your Experience">
            <div className="space-y-6">
                <div className="text-center">
                    <p className="text-dark-400">How was your consultation with</p>
                    <h4 className="text-xl font-bold text-dark-50 mt-1">{doctorName}</h4>
                </div>

                <div className="flex justify-center py-4">
                    <StarRating
                        rating={rating}
                        interactive
                        size={40}
                        onRatingChange={setRating}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-dark-300">Share more details (Optional)</label>
                    <textarea
                        className="w-full bg-dark-800 border-dark-700 rounded-xl p-4 text-dark-50 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all h-32 resize-none"
                        placeholder="Tell us about the doctor's service, punctuality, etc."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button variant="outline" fullWidth onClick={onClose}>
                        Cancel
                    </Button>
                    <Button fullWidth onClick={handleSubmit}>
                        Submit Review
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
