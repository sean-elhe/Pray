import type { Prayer } from "../types";
import PrayerCard from "../modals/prayercard";
import { usePrayerNavigation } from "../hooks/navigation";

type PublicScreenProps = {
  prayers: Prayer[];
};

export default function PublicScreen({ prayers }: PublicScreenProps) {
  const { currentPrayer, currentIndex, direction, next, previous } =
    usePrayerNavigation(prayers);

  if (prayers.length === 0) {
    return (
      <>
        <header>
          <h1>Public Prayers</h1>
        </header>

        <main>
          <p>No prayers available.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <header>
        <h1>Public Prayers</h1>
      </header>

      <main>
        <PrayerCard
          key={currentPrayer.id}
          prayer={currentPrayer}
          onNext={next}
          onPrevious={previous}
          direction={direction}
          onLongPress={() => {}}
        />
      </main>

      <div className="counter">
        {currentIndex + 1} / {prayers.length}
      </div>
    </>
  );
}
