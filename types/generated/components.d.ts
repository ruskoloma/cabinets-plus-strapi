import type { Schema, Struct } from '@strapi/strapi';

export interface SharedMediaItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_media_items';
  info: {
    description: 'Image or video with optional tags and ranking for dynamic cover selection';
    displayName: 'Media Item';
  };
  attributes: {
    countertop_context: Schema.Attribute.Relation<
      'manyToOne',
      'api::countertop-type.countertop-type'
    >;
    countertop_priority: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    file: Schema.Attribute.Media<'images' | 'videos'> &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        'content-manager': {
          edit: {
            width: 8;
          };
        };
      }>;
    is_default: Schema.Attribute.Boolean &
      Schema.Attribute.SetPluginOptions<{
        'content-manager': {
          edit: {
            width: 4;
          };
        };
      }> &
      Schema.Attribute.DefaultTo<false>;
    paint_context: Schema.Attribute.Relation<'manyToOne', 'api::paint.paint'>;
    paint_priority: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    room_context: Schema.Attribute.Relation<
      'manyToOne',
      'api::room-type.room-type'
    >;
    room_priority: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    stain_context: Schema.Attribute.Relation<'manyToOne', 'api::stain.stain'>;
    stain_priority: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
  };
}

export interface SharedSpecItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_spec_items';
  info: {
    description: 'Flexible key/value technical detail row';
    displayName: 'Spec Item';
  };
  attributes: {
    key: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    unit: Schema.Attribute.String;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.media-item': SharedMediaItem;
      'shared.spec-item': SharedSpecItem;
    }
  }
}
