import org.bukkit.Material
import org.bukkit.entity.Villager
import org.bukkit.event.EventHandler
import org.bukkit.event.Listener
import org.bukkit.event.player.PlayerInteractEntityEvent
import org.bukkit.inventory.ItemStack
import org.bukkit.inventory.MerchantRecipe
import org.bukkit.plugin.java.JavaPlugin

class VillagerNerf : JavaPlugin() {
    override fun onEnable() {
        server.pluginManager.registerEvents(VillagerInteractListener(), this)
    }

    override fun onDisable() {
        // Plugin shutdown logic
    }
}

class VillagerInteractListener : Listener {

    @EventHandler
    fun onVillagerInteract(event: PlayerInteractEntityEvent) {
        val villager = event.rightClicked as? Villager ?: return

        if (villager.villagerExperience == 0) {
            villager.villagerExperience = 1
        }

        val recipes = villager.recipes.toMutableList()

        recipes.replaceAll { originalRecipe ->
            val firstIngredient = originalRecipe.ingredients.first();
            val result = originalRecipe.result

            if (result.type == Material.ENCHANTED_BOOK && firstIngredient.type == Material.EMERALD) {
                val newRecipe = MerchantRecipe(
                    result.clone(),
                    originalRecipe.uses,
                    originalRecipe.maxUses,
                    originalRecipe.hasExperienceReward(),
                    originalRecipe.villagerExperience,
                    originalRecipe.priceMultiplier
                );

                newRecipe.addIngredient(ItemStack(Material.DEEPSLATE_DIAMOND_ORE, firstIngredient.amount));
                if (originalRecipe.ingredients.size > 1) {
                    newRecipe.addIngredient(originalRecipe.ingredients[1].clone());
                }

                newRecipe
            } else {
                originalRecipe
            }
        }

        villager.recipes = recipes
    }
}
