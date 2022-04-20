import { useRouter } from "vue-router";

export const webviewUrl = process.env.VUE_APP_WEBVIEW_URL;

export const useAdLink = () => {
  const router = useRouter();
  const adLink = (type: string, param: string) => {
    switch (Number(type)) {
      case 0:
        router.push("/");
        break;
      case 1:
        router.push({
          path: "goods",
          query: {
            id: param,
          },
        });
        break;
      case 3:
        router.push({
          path: "/webview",
          query: {
            url: param.replace("http:", "https:"),
          },
        });
        break;
      case 10:
        router.push({
          path: "/live",
          query: {
            id: param,
          },
        });
        break;
      case 11:
        router.push("/mall");
        break;
    }
  };
  return adLink;
};

export const useCheckLogin = () => {
  const router = useRouter();
  const checkLogin = (success: () => void, toLogin = true) => {
    if (localStorage.getItem("token")) success();
    else {
      toLogin && router.push("/login");
    }
  };
  return checkLogin;
};

export const formatNumber = (n: number) => (n.toString()[1] ? n : "0" + n);

export const debounce = (fn: () => void, delay: number) => {
  let timer: any = null;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
};
