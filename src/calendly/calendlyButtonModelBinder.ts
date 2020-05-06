import { IModelBinder } from "@paperbits/common/editing";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { CalendlyButtonModel } from "./calendlyButtonModel";
import { Contract } from "@paperbits/common";
import { CalendlyButtonContract } from "./calendlyButtonContract";
import { BuiltInRoles } from "@paperbits/common/user";


export class CalendlyButtonModelBinder implements IModelBinder<CalendlyButtonModel>  {
    constructor(
        private readonly permalinkResolver: IPermalinkResolver
    ) {
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "calendlyButton";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof CalendlyButtonModel;
    }

    public async contractToModel(contract: CalendlyButtonContract): Promise<CalendlyButtonModel> {
        const model = new CalendlyButtonModel();
        model.label = contract.label;
        model.styles = contract.styles || { appearance: "components/calendlyButton/default" };
        model.calendlyLink = contract.calendlyLink;

        return model;
    }

    public modelToContract(model: CalendlyButtonModel): Contract {
        const roles = model.roles
            && model.roles.length === 1
            && model.roles[0] === BuiltInRoles.everyone.key
            ? null
            : model.roles;

        const calendlyButtonConfig: CalendlyButtonContract = {
            type: "calendlyButton",
            label: model.label,
            styles: model.styles,
            calendlyLink: model.calendlyLink
        };

        return calendlyButtonConfig;
    }
}
