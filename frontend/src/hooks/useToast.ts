import toast from 'react-hot-toast';

export const useToast = () => {
    const showToast = {
        success: (message: string) =>
            toast.success(message, {
                className: 'bg-dark-800 text-dark-50 border border-dark-700',
            }),
        error: (message: string) =>
            toast.error(message, {
                className: 'bg-dark-800 text-dark-50 border border-dark-700',
            }),
        loading: (message: string) =>
            toast.loading(message, {
                className: 'bg-dark-800 text-dark-50 border border-dark-700',
            }),
        dismiss: () => toast.dismiss(),
    };

    return { showToast };
};
