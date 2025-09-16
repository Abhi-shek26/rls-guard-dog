'use client';
import Button from "@/components/ui/Button";

export default function TriggerAverageButton({ classId }) {
  const handleCalculate = async () => {
    alert(`Calculating average for class: ${classId}`);
    await fetch('/api/class-average', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ class_id: classId }),
    });
    alert('Calculation triggered! Check your MongoDB collection.');
  };

  return <Button onClick={handleCalculate} className="mt-4 bg-green-600 hover:bg-green-700">Calculate Class Average</Button>;
}
