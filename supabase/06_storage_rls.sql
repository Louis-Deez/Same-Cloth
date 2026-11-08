DROP POLICY IF EXISTS "Public can view avatars and banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can replace their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

CREATE POLICY "Public can view avatars and banners" ON storage.objects
    FOR SELECT TO public
        USING (bucket_id IN ('avatars', 'banners'));

CREATE POLICY "Users can upload to their own folder" ON storage.objects
    FOR INSERT TO authenticated
        WITH CHECK (
            bucket_id IN ('avatars', 'banners')
            AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
        );

CREATE POLICY "Users can replace their own files" ON storage.objects
    FOR UPDATE TO authenticated
        USING (
            bucket_id IN ('avatars', 'banners')
            AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
        );

CREATE POLICY "Users can delete their own files" ON storage.objects
    FOR DELETE TO authenticated
        USING (
            bucket_id IN ('avatars', 'banners')
            AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
        );

