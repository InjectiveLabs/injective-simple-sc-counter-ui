<script setup lang="ts">
import { BigNumberInBase, Status, StatusType } from "@injectivelabs/utils";
import { useCounterStore } from "@/store/counter";

const counterStore = useCounterStore();
const status = reactive(new Status(StatusType.Idle));
const number = ref("0");

onMounted(() => {
  counterStore.fetchCount();
});

watch(
  () => counterStore.count,
  () => {
    number.value = counterStore.count.toString();
  }
);

function handleIncrementCount() {
  status.setLoading();

  counterStore
    .incrementCount()
    .catch(alert)
    .finally(() => {
      status.setIdle();
    });
}

function handleSetCount() {
  const numberInBn = new BigNumberInBase(number.value);

  if (numberInBn.gt(100) || numberInBn.lt(-100)) {
    return alert("Number must be within -100 to 100");
  }

  if (numberInBn.isNaN()) {
    return alert("Input is not a valid number");
  }

  status.setLoading();

  counterStore
    .setCount(numberInBn.toFixed(0))
    .catch(alert)
    .finally(() => {
      status.setIdle();
    });
}
</script>

<template>
  <div class="bg-white">
    <Container class="py-2 flex justify-between items-center">
      <h1>Counter Example</h1>
      <ConnectWallet />
    </Container>
  </div>
  <Container class="grid place-items-center py-20">
    <Card>
      <div class="py-10">
        <h1 class="text-center text-2xl">The count is:</h1>
        <h3 class="text-3xl font-bold text-center">
          {{ status.isLoading() ? "Loading ..." : counterStore.count }}
        </h3>
      </div>
      <div class="py-2">
        <Button
          :disabled="status.isLoading()"
          @click="handleIncrementCount"
          class="w-full"
        >
          +
        </Button>
      </div>
      <div class="flex gap-2">
        <input
          v-model="number"
          type="number"
          step="1"
          class="border rounded-lg p-2"
        />
        <Button @click="handleSetCount" :disabled="status.isLoading()">
          Set Count
        </Button>
      </div>
      <div class="flex justify-center py-5">
        <a
          class="text-blue-500 underline text-center"
          target="_blank"
          referrerpolicy="no-referrer"
          href="https://testnet.explorer.injective.network/contract/inj1t8rhq5vcxqgw68ldg0k2mjxjvzshuah6tnugvy/"
        >
          View Contract on Explorer
        </a>
      </div>
    </Card>
  </Container>
</template>
