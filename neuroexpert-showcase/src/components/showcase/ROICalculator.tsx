import React, { useState } from 'react';

const ROICalculator: React.FC = () => {
    const [investment, setInvestment] = useState<number>(0);
    const [returnValue, setReturnValue] = useState<number>(0);
    const [roi, setRoi] = useState<number | null>(null);

    const calculateROI = () => {
        if (investment > 0) {
            const calculatedROI = ((returnValue - investment) / investment) * 100;
            setRoi(Number(calculatedROI.toFixed(2)));
        } else {
            setRoi(null);
        }
    };

    return (
        <div className="roi-calculator">
            <h2>ROI Calculator</h2>
            <div>
                <label>
                    Investment Amount:
                    <input
                        type="number"
                        value={investment}
                        onChange={(e) => setInvestment(Number(e.target.value))}
                    />
                </label>
            </div>
            <div>
                <label>
                    Return Value:
                    <input
                        type="number"
                        value={returnValue}
                        onChange={(e) => setReturnValue(Number(e.target.value))}
                    />
                </label>
            </div>
            <button onClick={calculateROI}>Calculate ROI</button>
            {roi !== null && (
                <div>
                    <h3>ROI: {roi}%</h3>
                </div>
            )}
        </div>
    );
};

export default ROICalculator;