function FollowUpQuestion({
  question
}) {
  if (!question) return null;

  return (
    <div className="followup-box">
      💬 {question}
    </div>
  );
}

export default FollowUpQuestion;