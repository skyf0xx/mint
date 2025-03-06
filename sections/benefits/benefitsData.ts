import { Shield, ArrowRight, TrendingUp } from 'lucide-react';
import { BenefitCardProps } from './BenefitCard';

// Type omitting the icon property which needs to be imported directly
type BenefitDataType = Omit<BenefitCardProps, 'icon'> & {
    icon: 'Shield' | 'ArrowRight' | 'TrendingUp';
};

// Raw data without actual icon components
const rawBenefitsData: BenefitDataType[] = [
    {
        icon: 'ArrowRight',
        title: 'Single-Sided Simplicity',
        description:
            'Provide liquidity on Botega with just one token. MINT automatically creates complete LP positions without requiring paired tokens.',
        content: [
            'No paired tokens required - stake your preferred token directly',
            'Maintain 100% exposure to your asset of choice',
            'MINT provides the other side of the LP position',
            'The LP is created on Botega and staked on MINT automatically',
            'You can withdraw at anytime',
        ],
        index: 0,
    },
    {
        icon: 'Shield',
        title: 'Impermanent Loss Protection',
        description:
            'MINT gradually accumulates IL protection, reaching up to 50% after 30 days, reducing the common risk associated with liquidity provision.',
        content: [
            'Progressive IL protection starts from day 1',
            'Reaches full 50% protection after 30 days',
            'Protection is applied automatically on withdrawal',
            'Cover is provided by the protocol reserve',
            'No additional cost or action required',
        ],
        index: 1,
        isHighlighted: true,
    },
    {
        icon: 'TrendingUp',
        title: 'Enhanced Returns',
        description:
            'Earn trading fees from Botega pools plus additional MINT rewards, maximizing your yield while minimizing exposure to impermanent loss.',
        content: [
            'Earn 100% of standard Botega trading fees',
            'Receive additional MINT token rewards',
            'Benefit from auto-compounding of rewards',
            'Maintain upside potential of your token',
            'Reduce impact of market volatility on returns',
        ],
        index: 2,
    },
];

// Map the string icon names to actual imported icon components
const benefitsData = rawBenefitsData.map((benefit) => {
    let IconComponent;
    switch (benefit.icon) {
        case 'Shield':
            IconComponent = Shield;
            break;
        case 'ArrowRight':
            IconComponent = ArrowRight;
            break;
        case 'TrendingUp':
            IconComponent = TrendingUp;
            break;
    }

    return {
        ...benefit,
        icon: IconComponent,
    };
});

export default benefitsData;
