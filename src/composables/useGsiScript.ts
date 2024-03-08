import { onMounted, onUnmounted, readonly, ref, watch, type Ref } from "vue";

const loaded = ref(false);
const isLoading = ref(false);
const error = ref(false);
const subscriberCount = ref(0);

let scriptTag: HTMLScriptElement | null = null;

const createScriptTag = () => {
  const scriptTag = document.createElement("script");
  scriptTag.src = "https://accounts.google.com/gsi/client";
  scriptTag.async = true;
  scriptTag.defer = true;

  return scriptTag;
};

const initialize = () => {
  isLoading.value = true;
  scriptTag = createScriptTag();
  document.head.appendChild(scriptTag);

  scriptTag.onload = () => {
    isLoading.value = false;
    loaded.value = true;
  };

  scriptTag.onerror = () => {
    isLoading.value = false;
    error.value = true;
  };
};

watch(
  () => subscriberCount.value,
  (newCount, _oldCount) => {
    if (newCount > 0 && !loaded.value && !isLoading.value) {
      initialize();
    }
  },
);

export type UseGsiScriptReturn = {
  /**
   * Script loaded successfully
   *
   * @type {Readonly<Ref<boolean>>}
   */
  scriptLoaded: Readonly<Ref<boolean>>;

  /**
   * Failed to load the GSI script
   *
   * @type {Readonly<Ref<boolean>>}
   */
  scriptLoadError: Readonly<Ref<boolean>>;
};

/**
 * Use google GSI script in the application.
 *
 * This is automatically called when you use any of
 * the provided composables such as `useOneTap` or using the `GoogleSignInButton` component.
 *
 * No matter how many time this function called, it only loads the script once if it not present.
 *
 * @export
 * @return {*}  {UseGsiScriptReturn}
 */
export default function useGsiScript(): UseGsiScriptReturn {
  onMounted(() => {
    subscriberCount.value++;
  });

  onUnmounted(() => {
    subscriberCount.value--;
  });

  return {
    scriptLoaded: readonly(loaded),
    scriptLoadError: readonly(error),
  };
}
