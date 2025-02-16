from mitreattack.stix20 import MitreAttackData


def main():
    mitre_attack_data = MitreAttackData("backend/utils/data/enterprise-attack.json")

    groups = mitre_attack_data.get_groups(remove_revoked_deprecated=True)

    print(groups)


if __name__ == "__main__":
    main()