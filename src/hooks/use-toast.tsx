import * as React from "react";

// Toast Interface
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

// State and Action Types
interface State {
  toasts: Toast[];
}

type Action =
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "REMOVE_TOAST"; id: string };

// Constants
const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 10000;

// Map for managing timeouts
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

// Helper function to queue toast removal
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      id: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

// Reducer function
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "REMOVE_TOAST":
      const { id } = action;

      if (toastTimeouts.has(id)) {
        clearTimeout(toastTimeouts.get(id)!);
        toastTimeouts.delete(id);
      }

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== id),
      };

    default:
      return state;
  }
};

// State listeners and memory state
const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

// Dispatch function
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

// ID Generator
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

// Toast API
export function toast(props: Omit<Toast, "id">) {
  const id = genId();

  const update = (props: Toast) =>
    dispatch({
      type: "ADD_TOAST",
      toast: { ...props, id },
    });

  const dismiss = () => dispatch({ type: "REMOVE_TOAST", id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      duration: props.duration ?? TOAST_REMOVE_DELAY,
    },
  });

  addToRemoveQueue(id);

  return {
    id,
    dismiss,
    update,
  };
}

// Hook to use toast state
export function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId: string) => dispatch({ type: "REMOVE_TOAST", id: toastId }),
  };
}

// Helper function for toast variants
function ToastVariant(variant: Toast["variant"]) {
  switch (variant) {
    case "destructive":
      return "bg-red-600 text-white";
    case "default":
    default:
      return "bg-white text-gray-900";
  }
}

// Toast Container Component
export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const variantStyles = ToastVariant(toast.variant);

        return (
          <div
            key={toast.id}
            className={`${variantStyles} rounded-lg shadow-lg p-4 min-w-[300px] transform transition-all duration-300 ease-in-out`}
          >
            {toast.title && <div className="font-semibold mb-1">{toast.title}</div>}
            {toast.description && <div className="text-sm">{toast.description}</div>}
          </div>
        );
      })}
    </div>
  );
}
