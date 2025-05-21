export interface GoogleDriveFile {
  kind: string;
  id: string;
  name: string;
  mimeType: string;
  description?: string;
  starred?: boolean;
  trashed?: boolean;
  explicitlyTrashed?: boolean;
  trashingUser?: {
    kind: string;
    displayName: string;
    photoLink: string;
    me: boolean;
    permissionId: string;
    emailAddress: string;
  };
  trashedTime?: string;
  parents?: string[];
  properties?: Record<string, string>;
  appProperties?: Record<string, string>;
  spaces?: string[];
  version?: string;
  webContentLink?: string;
  webViewLink?: string;
  iconLink?: string;
  hasThumbnail?: boolean;
  thumbnailLink?: string;
  thumbnailVersion?: string;
  viewedByMe?: boolean;
  viewedByMeTime?: string;
  createdTime?: string;
  modifiedTime?: string;
  modifiedByMeTime?: string;
  modifiedByMe?: boolean;
  sharedWithMeTime?: string;
  sharingUser?: {
    kind: string;
    displayName: string;
    photoLink: string;
    me: boolean;
    permissionId: string;
    emailAddress: string;
  };
  owners?: Array<{
    kind: string;
    displayName: string;
    photoLink: string;
    me: boolean;
    permissionId: string;
    emailAddress: string;
  }>;
  teamDriveId?: string;
  driveId?: string;
  lastModifyingUser?: {
    kind: string;
    displayName: string;
    photoLink: string;
    me: boolean;
    permissionId: string;
    emailAddress: string;
  };
  shared?: boolean;
  ownedByMe?: boolean;
  capabilities?: {
    canAddChildren?: boolean;
    canAddMyDriveParent?: boolean;
    canChangeCopyRequiresWriterPermission?: boolean;
    canChangeViewersCanCopyContent?: boolean;
    canComment?: boolean;
    canCopy?: boolean;
    canDelete?: boolean;
    canDownload?: boolean;
    canEdit?: boolean;
    canListChildren?: boolean;
    canModifyContent?: boolean;
    canMoveChildrenWithinDrive?: boolean;
    canMoveItemIntoTeamDrive?: boolean;
    canMoveItemOutOfDrive?: boolean;
    canMoveItemWithinDrive?: boolean;
    canReadRevisions?: boolean;
    canReadTeamDrive?: boolean;
    canRemoveChildren?: boolean;
    canRemoveMyDriveParent?: boolean;
    canRename?: boolean;
    canShare?: boolean;
    canTrash?: boolean;
    canUntrash?: boolean;
  };
  viewersCanCopyContent?: boolean;
  copyRequiresWriterPermission?: boolean;
  writersCanShare?: boolean;
  permissions?: Array<{
    kind: string;
    id: string;
    type: string;
    emailAddress?: string;
    domain?: string;
    role: string;
    allowFileDiscovery?: boolean;
    displayName?: string;
    photoLink?: string;
    expirationTime?: string;
    teamDrivePermissionDetails?: Array<{
      teamDrivePermissionType: string;
      role: string;
      inheritedFrom?: string;
      inherited?: boolean;
    }>;
    permissionDetails?: Array<{
      permissionType: string;
      role: string;
      inheritedFrom?: string;
      inherited?: boolean;
    }>;
    deleted?: boolean;
  }>;
  permissionIds?: string[];
  hasAugmentedPermissions?: boolean;
  folderColorRgb?: string;
  originalFilename?: string;
  fullFileExtension?: string;
  fileExtension?: string;
  md5Checksum?: string;
  size?: string;
  quotaBytesUsed?: string;
  headRevisionId?: string;
  contentHints?: {
    thumbnail?: {
      image?: string;
      mimeType?: string;
    };
    indexableText?: string;
  };
  imageMediaMetadata?: {
    width?: number;
    height?: number;
    rotation?: number;
    location?: {
      latitude: number;
      longitude: number;
      altitude: number;
    };
    time?: string;
    cameraMake?: string;
    cameraModel?: string;
    exposureTime?: number;
    aperture?: number;
    flashUsed?: boolean;
    focalLength?: number;
    isoSpeed?: number;
    meteringMode?: string;
    sensor?: string;
    exposureMode?: string;
    colorSpace?: string;
    whiteBalance?: string;
    exposureBias?: number;
    maxApertureValue?: number;
    subjectDistance?: number;
    lens?: string;
  };
  videoMediaMetadata?: {
    width?: number;
    height?: number;
    durationMillis?: string;
  };
  isAppAuthorized?: boolean;
  exportLinks?: Record<string, string>;
}

export interface GoogleDriveFileList {
  kind: string;
  incompleteSearch?: boolean;
  files: GoogleDriveFile[];
  nextPageToken?: string;
}