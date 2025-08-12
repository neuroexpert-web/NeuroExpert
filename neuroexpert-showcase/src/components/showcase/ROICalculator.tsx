import React, { useState } from 'react';

const ROICalculator = () => {
    const [investment, setInvestment] = useState(0);
    const [returnValue, setReturnValue] = useState(0);
    const [roi, setRoi] = useState(null);

    const calculateROI = () => {
        if (investment > 0) {
            const calculatedROI = ((returnValue - investment) / investment) * 100;
            setRoi(calculatedROI.toFixed(2));
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