declare module "vue-muscle-group-selector" {
  import type { DefineComponent } from "vue";

  type MuscleTranslations = {
    arms: Record<string, string>;
    back: Record<string, string>;
    core: Record<string, string>;
    legs: Record<string, string>;
  };

  type Props = {
    allowMultiple?: boolean;
    primaryColor?: string;
    muscleColor?: string;
    strokeColor?: string;
    initialValues?: string[];
    showMusclesListHelper?: boolean;
    showBackMuscles?: boolean;
    showFrontMuscles?: boolean;
    translations?: MuscleTranslations;
    readOnly?: boolean;
    onOnSelect?: (selection: string[]) => void;
  };

  const VueMuscleGroupSelector: DefineComponent<Props>;
  export default VueMuscleGroupSelector;
}
