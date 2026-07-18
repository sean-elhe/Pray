import { Bars3Icon, UserIcon } from "@heroicons/react/24/outline";

type TopBarProps = {
  goToHome: () => void;
  goToAdd: () => void;
  goToAccount: () => void;
};

export function TopBar({ goToHome, goToAdd, goToAccount }: TopBarProps) {
  return (
    <nav>
      <button
        onClick={goToHome}
        className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      <button onClick={goToAdd} className="text-2xl font-serif tracking-wide">
        Pray
      </button>

      <button
        onClick={goToAccount}
        className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <UserIcon className="h-5 w-5 text-stone-600" />
      </button>
    </nav>
  );
}
