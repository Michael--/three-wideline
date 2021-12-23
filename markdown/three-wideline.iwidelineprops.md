<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [three-wideline](./three-wideline.md) &gt; [IWidelineProps](./three-wideline.iwidelineprops.md)

## IWidelineProps interface

Line properties.

<b>Signature:</b>

```typescript
export interface IWidelineProps 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [attr](./three-wideline.iwidelineprops.attr.md) | [IAttribute](./three-wideline.iattribute.md) \| [IAttribute](./three-wideline.iattribute.md)<!-- -->\[\] | The line attribute, use an array to draw multiple lines with same geometry. |
|  [capsEnd?](./three-wideline.iwidelineprops.capsend.md) | [Caps](./three-wideline.caps.md) | <i>(Optional)</i> The end cap of the line |
|  [capsStart?](./three-wideline.iwidelineprops.capsstart.md) | [Caps](./three-wideline.caps.md) | <i>(Optional)</i> The start cap of the line |
|  [custom?](./three-wideline.iwidelineprops.custom.md) | { scheme: [IScheme](./three-wideline.ischeme.md)<!-- -->; geometry: [IGeometry](./three-wideline.igeometry.md)<!-- -->; }\[\] | <b><i>(BETA)</i></b> <i>(Optional)</i> A user defined custom element for any segment of the line |
|  [join?](./three-wideline.iwidelineprops.join.md) | [Joins](./three-wideline.joins.md) | <i>(Optional)</i> Which joins are used |
|  [opacity?](./three-wideline.iwidelineprops.opacity.md) | number | <i>(Optional)</i> Line opacity, is less than 1, the line is transparent. Optimized shader are used in that case. |
|  [points](./three-wideline.iwidelineprops.points.md) | [Shape](./three-wideline.shape.md) | The shape of the line, some points. |
