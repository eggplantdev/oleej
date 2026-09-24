<script lang="ts">
  import { enhance } from '$app/forms';

  import { Button } from '../ui/button/index.js';
  import type { CommentType } from '../../types';
  import SmallArowUp from '../../assets/SmallArowUp.svelte';
  import * as Accordion from '../ui/accordion';
  import type { ActionResult } from '@sveltejs/kit';
  import { sendingForm } from '../../store/global';

  export let post_id: number;
  export let comment: CommentType;

  let content = '';
  let sign = '';
  let value = 'item-1';
  let dialog: HTMLDialogElement;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const errorMessage = 'oj coś nie pykło..., spróbuj jeszcze raz lub zgłoś problem: piotrolej@gmail.com';

  function handleSubmit() {
    return async ({
      result,
      update,
    }: {
      result: ActionResult<any, any>;
      update: (opts?: { reset?: boolean; invalidateAll?: boolean }) => Promise<void>;
    }) => {
      sendingForm.set(true);
      value = '';
      if (result.type === 'success') {
        await update({ reset: false });
        sendingForm.set(false);
        content = '';
        sign = '';
      } else {
        dialog.show();
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          dialog.close();
        }, 3000);
      }
      sendingForm.set(false);
    };
  }
</script>

<Accordion.Root class=" w-full max-w-[600px]  ">
  <Accordion.Item value="{value}" class="border-none ">
    <Accordion.Trigger class="py-0 pb-0 [&_.arrowUp]:opacity-100 [&_svg]:opacity-0 ">
      <div class=" flex items-center gap-x-1">
        <span class="text-[0.875rem] uppercase md:text-[1rem]"> Odpowiedz </span>
        <SmallArowUp className="rotate-90" />
      </div>
    </Accordion.Trigger>
    <Accordion.Content class="pl-4 pt-2 ">
      <form
        class="{'flex flex-col items-start gap-y-4'}"
        action="?/add_comment_response"
        method="POST"
        use:enhance="{handleSubmit}"
      >
        <input type="hidden" name="post_id" value="{post_id}" />
        <input type="hidden" name="parent" value="{comment.databaseId}" />
        <div class="absolute -left-[9999px]" aria-hidden="true">
          <input type="text" name="hp_x7" tabindex="-1" autocomplete="off" />
        </div>
        <div class="grid w-full gap-y-1">
          <textarea
            on:focus="{() => sendingForm.set(false)}"
            bind:value="{content}"
            placeholder="treść"
            required
            class="h-40 border border-black bg-primary p-4  placeholder:text-black"
            name="content"></textarea>
        </div>
        <div class="grid w-full gap-x-4 md:grid-cols-2">
          <div class="grid h-[46px] w-full gap-y-4">
            <input
              on:focus="{() => sendingForm.set(false)}"
              placeholder="podpis"
              required
              class="h-[46px] border border-black bg-primary p-4 placeholder:text-black"
              type="text"
              name="author_name"
              bind:value="{sign}"
            />
          </div>
          <Button
            class=" mt-2 flex h-[46px] items-center justify-center space-x-4 rounded-none border border-black !bg-black px-4 text-[1.25rem] font-bold uppercase text-white duration-500 md:mt-0 md:!bg-transparent md:text-black md:hover:!bg-black md:hover:!text-white"
            on:click="{() => sendingForm.set(true)}"
            type="submit"
            variant="outline">
            <span class='pt-1'>
              Wyślij
            </span></Button
          >
        </div>
      </form>
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
<dialog
  on:click="{() => dialog.close()}"
  class=" fixed inset-0 z-[1000] max-w-[260px] cursor-pointer rounded bg-transparent text-[26px]"
  bind:this="{dialog}"
>
  <p>
    {errorMessage}
  </p>
</dialog>
