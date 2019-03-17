import { BlockModel } from "../text/models";
import { IModelBinder } from "@paperbits/common/editing";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { Contract } from "@paperbits/common";
import { TextblockModel } from "./textblockModel";

export class TextblockModelBinder implements IModelBinder {
    constructor(private readonly modelBinderSelector: ModelBinderSelector) { }

    public async contractToModel(contract: Contract): Promise<TextblockModel> {
        let content: BlockModel[] = [];

        if (contract.nodes && contract.nodes.length > 0) {
            const modelPromises = contract.nodes.map(async (contract: Contract) => {
                const modelBinder = this.modelBinderSelector.getModelBinderByContract(contract);
                return await modelBinder.contractToModel(contract);
            });

            content = await Promise.all<BlockModel>(modelPromises);
        }

        return new TextblockModel(content);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "text-block";
    }

    public canHandleModel(model: TextblockModel): boolean {
        return model instanceof TextblockModel;
    }

    public modelToContract(model: TextblockModel): Contract {
        let state;

        if (model.htmlEditor) {
            model.state = <any>model.htmlEditor.getState();
        }

        const isArray = Array.isArray(model.state);

        if (isArray) {
            const contentItems = model.state as Object[];

            if (contentItems && contentItems.length > 0) {
                state = contentItems.map(contentItem => {
                    const modelBinder = this.modelBinderSelector.getModelBinderByModel(contentItem);
                    return modelBinder.modelToContract(contentItem);
                });
            }
        }

        const contract: Contract = {
            type: "text-block",
            nodes: state
        };

        return contract;
    }
}