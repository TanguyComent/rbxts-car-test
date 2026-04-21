/**
 * Object Pooling utility for Instances.
 * Tags and attributes are reset on release.
 */
export class InstancePool<SuperInstance extends Instance> {
    private pool: SuperInstance[] = [];
    private initialObject: SuperInstance;
    private maxPoolSize: number;

    /// Reinitialisation des instances
    private initialTags: string[];
    private initialAttributes: Map<string, AttributeValue>;
    private resetTreatment?: (instance: SuperInstance) => void;

    /**
     * Create an instance pool
     * @param initialObject The object to clone for new instances, work as a template
     * @param initialPoolSize The initial number of instances in the pool
     * @param maxPoolSize The maximum number of instances in the pool
     * @param resetTreatment Every pooled instance will pass by this function when acquired from the pool
     */
    constructor(
        initialObject: SuperInstance, 
        initialPoolSize: number,
        maxPoolSize: number, 
        resetTreatment?: (instance: SuperInstance) => void 
    ) {
        this.initialObject = initialObject.Clone();
        this.maxPoolSize = maxPoolSize;

        this.initialTags = initialObject.GetTags();
        this.initialAttributes = initialObject.GetAttributes();
        this.resetTreatment = resetTreatment;

        for (let i = 0; i < initialPoolSize; i++) {
            this.pool.push(this.createNewInstance());
        }
    }

    /**
     * Acquire an instance from the pool
     */
    acquire(): {instance: SuperInstance, Release: () => void} {
        let popedInstance = this.pool.pop();
        if (!popedInstance) {
            popedInstance = this.createNewInstance();
        }

        return {instance: popedInstance, Release: () => this.release(popedInstance)};
    }

    /**
     * After using an instance, put it back in the pool
     * @param instance The instance to release
     */
    release(instance: SuperInstance) {
        this.resetInstance(instance);
        instance.Parent = undefined;

        if (this.pool.size() >= this.maxPoolSize) {
            instance.Destroy();
        } else {
            this.pool.push(instance);
        }
    }

    /**
     * Pre-fill the pool with new instances
     * @param additionnalInstances The number of instances to add to the pool
     * @param ignoreMaxSize Ignore the max size of the pool if true
     */
    warmup(additionnalInstances: number, ignoreMaxSize = false) {
        const objectsToAdd = ignoreMaxSize ? 
            additionnalInstances : math.min(additionnalInstances, this.maxPoolSize - this.pool.size());

        for (let i = 0; i < objectsToAdd; i++) {
            this.pool.push(this.createNewInstance());
        }
    }

    /**
     * Fill the pool to its max size
     */
    fill() {
        const objectsToAdd = this.maxPoolSize - this.pool.size();
        for (let i = 0; i < objectsToAdd; i++) {
            this.pool.push(this.createNewInstance());
        }
    }

    private resetInstance(instance: SuperInstance) {
        // Reset tags
        instance.GetTags().forEach(tag => instance.RemoveTag(tag))
        this.initialTags.forEach(tag => instance.AddTag(tag))

        // Reset attributes
        instance.GetAttributes().forEach((_, key) => {
            const defaultValue = this.initialAttributes.get(key)
            instance.SetAttribute(key, defaultValue)
        })

        this.resetTreatment?.(instance);
    }

    private createNewInstance(): SuperInstance {
        const newInstance = this.initialObject.Clone()
        newInstance.Parent = undefined;
        return newInstance;
    }
}