interface Props {
  onclick?: (e: MouseEvent) => void;
  children: any;
}

export function Button(props: Props) {
  return (
    <button
      class="rounded-md bg-stone-500 px-4 py-1 text-lg text-white transition-colors hover:bg-stone-600"
      onclick={props.onclick}
    >
      {props.children}
    </button>
  );
}
