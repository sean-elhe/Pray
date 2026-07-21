import type { Prayer } from "../types";
import PrayerCard from "../modals/PrayerCard";
import { usePrayerNavigation } from "../hooks/usePrayerNavigation";

type SharedScreenProps = {
  prayers: Prayer[];
};

export default function SharedScreen({ prayers }: SharedScreenProps) {
  const { currentPrayer, currentIndex, direction, next, previous } =
    usePrayerNavigation(prayers);

  if (prayers.length === 0) {
    return (
      <>
        <header>
          <h1>Shared Prayers</h1>
        </header>

        <main>
          <p>No prayers available.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <div className="background-glow" />

      <main>
        <PrayerCard
          key={currentPrayer.id}
          prayer={currentPrayer}
          onNext={next}
          onPrevious={previous}
          direction={direction}
          editing={false}
          publicPrayer={false}
          isSavedScreen={false}
          setPublicPrayer={() => {}}
          onCancelEdit={() => {}}
          onSaveEdit={() => {}}
          onDoubleTap={() => {}}
          onCategoryClick={() => {}}
        />
      </main>

      <section>
        <div className="counter">
          {currentIndex + 1} / {prayers.length}
        </div>
      </section>
    </>
  );
}
