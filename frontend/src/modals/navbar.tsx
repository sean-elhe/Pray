import { User, House } from "lucide-react";

type NavBarProps = {
  goToHome: () => void;
  goToAdd: () => void;
  goToAccount: () => void;
};

export function NavBar({ goToHome, goToAdd, goToAccount }: NavBarProps) {
  return (
    <nav>
      <button onClick={goToHome} className="home">
        <House size={22} />
      </button>

      <button onClick={goToAdd} className="add">
        +
      </button>

      <button onClick={goToAccount} className="account">
        <User size={22} />
      </button>
    </nav>
  );
}
