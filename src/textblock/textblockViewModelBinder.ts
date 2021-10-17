import { Bag } from "@paperbits/common";
import { ComponentFlow, IWidgetBinding } from "@paperbits/common/editing";
import { EventManager } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { TextblockViewModel } from "./ko/textblockViewModel";
import { TextblockModel } from "./textblockModel";


export class TextblockViewModelBinder implements ViewModelBinder<TextblockModel, TextblockViewModel> {
    constructor(
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler
    ) { }

    public async modelToViewModel(model: TextblockModel, viewModel?: TextblockViewModel, bindingContext?: Bag<any>): Promise<TextblockViewModel> {
        if (!viewModel) {
            viewModel = new TextblockViewModel();
        }

        viewModel.content(model.content);

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        const widgetBinding: IWidgetBinding<TextblockModel, TextblockViewModel> = {
            name: "text-block",
            displayName: "Text",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: true,
            flow: ComponentFlow.Block,
            editor: "text-block-editor",
            editorResize: "horizontally",
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        viewModel["widgetBinding"] = widgetBinding;

        return viewModel;
    }

    public canHandleModel(model: TextblockModel): boolean {
        return model instanceof TextblockModel;
    }
}