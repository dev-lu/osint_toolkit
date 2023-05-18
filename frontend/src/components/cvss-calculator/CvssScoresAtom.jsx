import { atom } from 'recoil';

export const cvssScoresAtom = atom({
    key: 'cvssScoresAtom',
    default: {
      base: {
        attackVector: "N",
        attackComplexity: "L",
        privilegesRequired: "N",
        userInteraction: "N",
        scope: "U",
        confidentialityImpact: "N",
        integrityImpact: "N",
        availabilityImpact: "N",
        baseScore: 0,
        baseSeverity: "",
        exploitabilityScore: 0,
        impactScore: 0
      },
      temporal: {
        exploitCodeMaturity: "X",
        remediationLevel: "X",
        reportConfidence: "X",
        temporalScore: 0,
        temporalSeverity: ""
      },
      environmental: {
        confidentialityRequirement: "X",
        integrityRequirement: "X",
        availabilityRequirement: "X",
        modifiedAttackVector: "X",
        modifiedAttackComplexity: "X",
        modifiedPrivilegesRequired: "X",
        modifiedUserInteraction: "X",
        modifiedScope: "X",
        modifiedConfidentialityImpact: "X",
        modifiedIntegrityImpact: "X",
        modifiedAvailabilityImpact: "X",
        environmentalScore: 0, 
        modifiedImpactSubScore: 0,
        modifiedImpactScore: 0,
        modifiedExploitabilityScore: 0,
        environmentalSeverity: ""
      },
    },
});