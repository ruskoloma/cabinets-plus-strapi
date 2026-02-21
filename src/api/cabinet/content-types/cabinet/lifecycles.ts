import { errors } from '@strapi/utils';

const { ValidationError } = errors;

type RelationPayload =
  | null
  | undefined
  | { id?: number; documentId?: string; connect?: unknown[]; disconnect?: unknown[]; set?: unknown[] }
  | unknown[];

const hasRelation = (value: RelationPayload, fallback = false): boolean => {
  if (value === undefined) return fallback;
  if (value === null) return false;

  if (Array.isArray(value)) return value.length > 0;

  if (typeof value === 'object') {
    if ('set' in value && Array.isArray(value.set)) return value.set.length > 0;
    if ('connect' in value && Array.isArray(value.connect) && value.connect.length > 0) return true;
    if ('disconnect' in value && Array.isArray(value.disconnect) && value.disconnect.length > 0) return false;
    if ('id' in value || 'documentId' in value) return true;
  }

  return fallback;
};

const readCurrentCabinet = async (where: Record<string, unknown>) => {
  if (!where || Object.keys(where).length === 0) return null;

  return strapi.db.query('api::cabinet.cabinet').findOne({
    where,
    populate: {
      paint: true,
      stain: true,
    },
  });
};

const validateFinish = async (event: { params: { data?: Record<string, unknown>; where?: Record<string, unknown> } }) => {
  const data = event.params.data ?? {};
  const where = event.params.where;

  const current = where ? await readCurrentCabinet(where) : null;

  const finishType = (data.finish_type as 'paint' | 'stain' | undefined) ?? (current?.finish_type as 'paint' | 'stain' | undefined);

  const paintSelected = hasRelation(data.paint as RelationPayload, Boolean(current?.paint));
  const stainSelected = hasRelation(data.stain as RelationPayload, Boolean(current?.stain));

  if (!finishType) {
    throw new ValidationError('finish_type is required and must be paint or stain.');
  }

  if (paintSelected === stainSelected) {
    throw new ValidationError('Exactly one finish must be selected: either paint or stain.');
  }

  if (finishType === 'paint' && !paintSelected) {
    throw new ValidationError('finish_type=paint requires paint relation and no stain relation.');
  }

  if (finishType === 'stain' && !stainSelected) {
    throw new ValidationError('finish_type=stain requires stain relation and no paint relation.');
  }
};

export default {
  async beforeCreate(event: { params: { data?: Record<string, unknown> } }) {
    await validateFinish(event as { params: { data?: Record<string, unknown>; where?: Record<string, unknown> } });
  },

  async beforeUpdate(event: { params: { data?: Record<string, unknown>; where?: Record<string, unknown> } }) {
    await validateFinish(event);
  },
};
