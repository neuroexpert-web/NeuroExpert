import React from 'react';

const BusinessSegmentSelector = ({ onSelectSegment }) => {
    const segments = [
        { id: 'small', label: 'Малый бизнес' },
        { id: 'medium', label: 'Средний бизнес' },
        { id: 'large', label: 'Крупный бизнес' },
    ];

    return (
        <div className="business-segment-selector">
            <h2>Выберите сегмент вашего бизнеса</h2>
            <div className="segment-buttons">
                {segments.map(segment => (
                    <button
                        key={segment.id}
                        onClick={() => onSelectSegment(segment.id)}
                        className="segment-button"
                    >
                        {segment.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BusinessSegmentSelector;