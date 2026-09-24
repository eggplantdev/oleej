<script lang="ts">
  import type { CommentType } from '../../types';
  import * as Accordion from '../ui/accordion';
  import CommentResponseForm from './CommentResponseForm.svelte';
  import { fade } from 'svelte/transition';

  export let post_id: number;
  export let comment: CommentType;
  export let responses: CommentType[];
  $: name = comment.author.node.name;
  $: content = comment.content;
</script>

<div in:fade="{{ duration: 500 }}">
  <div class="grid grid-cols-[32px_auto] items-center md:mb-2 md:grid-cols-[50px_auto]">
    <div class="aspect-square w-[20px] grow-0 bg-[#D9D9D9] md:w-[33px]"></div>
    <div class="flex h-[33px] items-center text-[1rem] font-bold md:text-[1.25rem]">
      <span>
        {name}
      </span>
    </div>
  </div>
  <div>
    <div class="mb-2 text-[0.875rem] md:text-[1.25rem]">{@html content}</div>
  </div>
  {#if responses.length > 0}
    <Accordion.Root class=" w-full max-w-[600px] ">
      <Accordion.Item value="item-1" class="border-none">
        <Accordion.Trigger class="items-center justify-start gap-x-1 pb-2 pt-0">
          <span class="order-1 text-[0.875rem] font-bold uppercase md:text-[1.25rem]">
            odpowiedzi {responses?.length}
          </span>
        </Accordion.Trigger>
        <Accordion.Content class=" pl-4 ">
          <div class="grid gap-y-6">
            {#each responses as response (response.id)}
              <div>
                <div class="mt-4 grid grid-cols-[20px_auto] items-center gap-x-3 md:grid-cols-[50px_auto] md:gap-4">
                  <div class="aspect-square w-[20px] grow-0 bg-[#D9D9D9] md:w-[33px]"></div>
                  <div class="flex h-[33px] items-center text-[1rem] font-bold">
                    <span>
                      {response.author.node.name}
                    </span>
                  </div>
                </div>
                <div>
                  <div class="mt-2 text-[0.875rem] md:text-[1.25rem]">{@html response.content}</div>
                </div>
              </div>
            {/each}
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  {/if}
  <CommentResponseForm post_id="{post_id}" comment="{comment}" />
</div>
