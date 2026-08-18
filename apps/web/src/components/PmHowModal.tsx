import { useEffect, useId, useRef } from "react";
import { getPmLesson, type PmLessonId } from "../pm/pmLessons";

export function PmHowModal({
  lessonId,
  onClose,
}: {
  lessonId: PmLessonId | null;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const lesson = lessonId ? getPmLesson(lessonId) : null;

  useEffect(() => {
    if (!lesson) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [lesson, onClose]);

  if (!lesson) return null;

  return (
    <div className="pm-modal-backdrop" onClick={onClose}>
      <div
        className="pm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <h2 id={titleId} className="pm-modal-title">
            {lesson.title}
          </h2>
          <button ref={closeRef} type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="pm-modal-body">
          <h3>What it is</h3>
          <p>{lesson.what}</p>
          <h3>Purpose</h3>
          <p>{lesson.purpose}</p>
          <h3>How project managers use it</h3>
          <p>{lesson.howUsed}</p>
          <h3>Need to know</h3>
          <ul>
            {lesson.know.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {lesson.extra?.map((block) => (
            <section key={block.heading}>
              <h3>{block.heading}</h3>
              <p>{block.body}</p>
            </section>
          ))}
          <h3>On this GYAM screen</h3>
          <p>{lesson.gyam}</p>
        </div>
      </div>
    </div>
  );
}

export function HowThisWorksButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="pm-how"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
    >
      How this works
    </button>
  );
}
