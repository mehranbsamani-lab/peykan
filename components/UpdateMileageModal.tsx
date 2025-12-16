import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { X, Gauge } from 'lucide-react';

interface UpdateMileageModalProps {
  currentMileage: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (mileage: number) => void;
}

export const UpdateMileageModal: React.FC<UpdateMileageModalProps> = ({ 
  currentMileage, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [mileage, setMileage] = useState(currentMileage.toString());

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(Number(mileage));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xs rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">بروزرسانی کیلومتر</h3>
          <button onClick={onClose} className="text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="number"
            inputMode="numeric"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            icon={<Gauge className="w-4 h-4" />}
            autoFocus
          />
          <Button type="submit" fullWidth>تایید</Button>
        </form>
      </div>
    </div>
  );
};
